/** HttpStatusCode
 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
declare module "muhipack:http-statuscode" {
  interface IHttpStatusCode {
    /* ### 1xx - Information ### */
    /** Continue - 100 @description !< Indicates that the initial part of a request has been received and has not yet been rejected by the server. */
    Continue: number;

    /* ### 2xx - Successfull ### */
    /** Ok - 200 @description!< Indicates that the request has succeeded. */
    Ok: number;

    /* ### 3xx - Redirection ### */
    /** MovedPermanently - 301 @description !< The URL of the requested resource has been changed permanently. The new URL is given in the response. */
    MovedPermanently: number;

    /* ### 4xx - Client Error ### */

    /** BadRequest - 400 @description
     * !< The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
     */
    BadRequest: number;

    /**
     * Forbidden - 403 @description !< The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike `401 Unauthorized`, the client's identity is known to the server. */
    Forbidden: number;
    /** NotFound - 404 @description !< The server cannot find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of `403 Forbidden` to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web. */
    NotFound: number;

    /** MethodNotAllowed - 405 @description indicates that the server knows the request method, but the target resource doesn't support this method. The server must generate an Allow header in a 405 response with a list of methods that the target resource currently supports. */
    MethodNotAllowed: number;

    /* ### 5xx - Server Error ### */
    /** InternalServerError - 500 @description !< The server has encountered a situation it does not know how to handle. */
    InternalServerError: number;
  }

  type IStructHttpStatusCode = {
    [K in keyof IHttpStatusCode]: IHttpStatusCode[K];
  };
  function reasonPhrase(
    statusCode: IHttpStatusCode[keyof IHttpStatusCode],
  ): string;
}
