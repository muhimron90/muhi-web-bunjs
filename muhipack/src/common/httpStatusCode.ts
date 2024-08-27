import type {
  IHttpStatusCode,
  IStructHttpStatusCode,
} from "muhipack:http-statuscode";

export let HttpStatus = {} as IStructHttpStatusCode;
(function (code) {
  code["Continue"] = 100;
  code["Ok"] = 200;
  code["MovedPermanently"] = 301;
  code["BadRequest"] = 400;
  code["Forbidden"] = 403;
  code["NotFound"] = 404;
  code["MethodNotAllowed"] = 405;
  code["InternalServerError"] = 500;
})(HttpStatus);
export function reasonPhrase(
  statusCode: IHttpStatusCode[keyof IHttpStatusCode],
): string {
  switch (statusCode) {
    case 100:
      return "Continue";
    case 200:
      return "Ok";
    case 301:
      return "Moved Permanently";
    case 400:
      return "Bad Request";
    case 403:
      return "Forbidden";
    case 404:
      return "Not Found";
    case 405:
      return "Method Not Allowed";
    case 500:
      return "Internal Server Error";
    default:
      return "\0";
  }
}
