export class AuthResponse{
    access_token:string;//description: "Bearer token for OAuth2"   
    token_type:string; //description: "Token type- bearer"   
    refresh_token:string;
    expires_in:number;
    scope:string;//description: "Scope of the token read write"
    jti:string;
}