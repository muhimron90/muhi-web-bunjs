type IErrorTypes = "ERMISSINGDIR" | "ERMISSINGFILE" | "FAILURE";

class MuhipackError extends Error {
  constructor(type: IErrorTypes) {
    super(type);
    Object.setPrototypeOf(this, new.target.prototype);
    this.#phraseErrorCode(type);
    this.name = type;
  }
  #phraseErrorCode(type: IErrorTypes) {
    switch (type) {
      case "ERMISSINGDIR":
        this.message = "Not Found";
        break;
      case "ERMISSINGFILE":
        this.message = "Method not allowd";
        break;
      case "FAILURE":
        this.message = "APP CRASH";
        break;
      default:
        this.message = "";
        break;
    }
  }
}
export default MuhipackError;
