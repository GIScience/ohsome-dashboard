import {Injectable, signal} from "@angular/core";
import {Models} from "appwrite";
import {account, functions, functionsList, Key, tables} from "./appwrite";
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class AuthService {
  private _user = signal<Models.User>({} as Models.User);
  public user = this._user.asReadonly()

  private _key = signal<Key>({} as Key)
  public key = this._key.asReadonly();
  public isAnon = signal<boolean>(true);
  public keyUnavailable = signal<boolean>(false);

  async initializeUser() {
    if (environment.skipAppwriteAPIKey && environment.skipAppwriteAPIKey.trim() !== '') {
      this._key.set({
        key: environment.skipAppwriteAPIKey
      } as Key)
      return;
    }

    return account.get()
      .then(async user => {
        this._user.set(user);
        this.isAnon.set(user.email === "");
        this._key.set(await this.getKey(!this.isAnon())
          .catch(e => {
            if (e.code === 404) {
              this.logout()
            }
            throw e;
          })
        );
        return user;
      })
      .catch(async e => {
        if (e.code !== 401) {
          console.error("Unexpected Error")
          throw e;
        } else {
          // user is not logged in yet
          await account.createAnonymousSession();
          this._user.set(await account.get());
          const response = await functions.createExecution(
            {
              functionId: functionsList["link_on_user_creation_anonymous"],
              body: JSON.stringify({
                "policy": "heigit_anonymous",
                "tag": "ohsome-api-client"
              })
            }
          );
          if (response.responseStatusCode !== 200) {
            this.keyUnavailable.set(true);
            return this._user;
          }
          this._key.set(await this.getKey(false));
          return this._user;
        }
      })
  }

  private async getKey(isFullUser: boolean) {
    return await tables.getRow({
      databaseId: "tyk_integration",
      tableId: isFullUser ? "basic_keys" : "anonymous_keys",
      rowId: this.user()!.$id
    }) as unknown as Key;
  }

  public login() {
    const currentUrl = window.location.href;
    window.location.href = `${environment.accountFrontendUrl}/login?redirect=${encodeURIComponent(currentUrl)}`;
  }

  public profile() {
    window.location.replace(environment.accountFrontendUrl)
  }

  public async logout() {
    await account.deleteSession({sessionId: 'current'})
    const currentUrl = window.location.href;
    const [path, query] = currentUrl.split('?');

    const isUserDashboard = path.includes('user-dashboard');
    if (isUserDashboard) {
      const targetUrl = query
        ? `/dashboard?${query}`
        : `/dashboard`;

      window.location.replace(targetUrl);
    } else {
      window.location.reload();
    }
  }

  register() {
    const currentUrl = window.location.href;
    window.location.href = `${environment.accountFrontendUrl}/signup?redirect=${encodeURIComponent(currentUrl)}`;
  }
}
