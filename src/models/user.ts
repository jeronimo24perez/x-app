export default interface User{
    _id?: string;
    username: string;
    email: string;
    date: string;
    bio: string;
    follows: number;
    followers: number;
    website:string;
    location:string;
}