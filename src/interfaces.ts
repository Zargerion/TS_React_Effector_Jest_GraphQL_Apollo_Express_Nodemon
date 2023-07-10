export interface DataItem {
    id: string;
    title: string;
    content: string;
};

export interface User {
    id: string;
    username: string;
    age: number;
    data?: DataItem[];
};