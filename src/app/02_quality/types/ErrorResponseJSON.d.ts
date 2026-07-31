export interface ErrorResponseJSON {
  apiVersion: string;
  type: string;
  detail: { msg: string }[];
}
