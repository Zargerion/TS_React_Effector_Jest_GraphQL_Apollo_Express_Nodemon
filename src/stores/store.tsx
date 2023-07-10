import { createEffect, createStore } from 'effector';
import client from '../apollo';
import { GET_ALL_USERS } from "../query/user"
import { CREATE_USER } from '../mutation/user';
import { useStore } from 'effector-react'
import { User } from '../interfaces';

const fetchUsersFx = createEffect(async () => {
    const response = await client.query<{ getAllUsers: User[] }>({ query: GET_ALL_USERS });
    const { data, loading, error } = response;
    return { data: data.getAllUsers, loading, error };
});
  
const $users = createStore<User[]>([])
    .on(fetchUsersFx.doneData, (_, { data }) => data)
    .on(fetchUsersFx.fail, (_, { error }) => {
    console.error('Failed to fetch users:', error);
});

const createUserFx = createEffect(async ({ username, age }: { username: string, age: number }) => {
    const response = await client.mutate({
        mutation: CREATE_USER,
        variables: { input: { username, age } },
    });
    return response.data.createUser;
});

const $username = createStore('')
.on(createUserFx.done, () => '')
.reset(createUserFx.fail);

const $age = createStore(0)
.on(createUserFx.done, () => 0)
.reset(createUserFx.fail);


export function UsersEff() {
    return useStore($users);
}
export function useUserEff() {
    return useStore($username);
}
export function useAgeEff() {
    return useStore($username);
}
export { $users };
export { $username };
export { $age };
export { fetchUsersFx };
export { createUserFx };





