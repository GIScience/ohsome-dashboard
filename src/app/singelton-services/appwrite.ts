import {Account, Client, Functions, TablesDB} from 'appwrite';
import {environment} from '@environments/environment';

export const client = new Client();

client
    .setEndpoint(environment.appwriteEndpoint + "/v1")
    .setProject(environment.appwriteProjectId);

export const account = new Account(client);
export const tables = new TablesDB(client);
export const functions = new Functions(client);

export const functionsList = {
    link_on_user_creation_anonymous: "66547d62eb180540b016"
};