import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import './App.css';
import { GET_ALL_USERS } from "./query/user"
import { CREATE_USER } from './mutation/user';
import { createEvent } from 'effector';
import { useStore } from 'effector-react'

import {fetchUsersFx, createUserFx, $username, $age, $users} from './stores/store';


function App() {
  interface User {
    id: string;
    username: string;
    age: number;
    data?: DataItem[];
  }
  
  interface DataItem {
    id: string;
    title: string;
    content: string;
  }

  const {data, loading, error, refetch} = useQuery(GET_ALL_USERS)
  const [newUser] = useMutation(CREATE_USER)

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Local State

  const [users, setUsers]: [User[], React.Dispatch<React.SetStateAction<never[]>>] = useState([]);
  const [username, setUsername]: [string, React.Dispatch<React.SetStateAction<string>>] = useState("");
  const [age, setAge]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0);

  useEffect(() => {
    if (!loading) {
      setUsers(data.getAllUsers)
    }
  }, [data, loading])
  if (error) {
    console.log(error)
  }
  //if (loading) {
  //  return <h1>Loading...</h1>
  //}

  const addUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    newUser({
      variables: {
        input: {
          username, age
        }
      }
    }).then(({data}) => {
      console.log(data)
      setUsername('')
      setAge(0)
    }
    );
  }

  const getUsers = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    refetch()
  }

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Effector State

  let usersEff = useStore($users);
  const usernameEff = useStore($username);
  const ageEff = useStore($age);

  const setUsersEff = createEvent<User[]>();
  $users.on(setUsersEff, (_, users) => users);

  const setUsernameEff = createEvent<string>();
  $username.on(setUsernameEff, (_, username) => username);

  const setAgeEff = createEvent<number>();
  $age.on(setAgeEff, (_, age) => age);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, loading, error } = await fetchUsersFx();
        if (!loading) {
          setUsersEff(data)
        }
        if (error) {
          console.log(error)
        }
      } catch (error) {
        console.log(error)
      }
    };
    fetchData();
  }, [setUsersEff]);

  const addUserEff = createEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>();
  addUserEff.watch((e) => {
    e.preventDefault();
    createUserFx({ username: $username.getState(), age: $age.getState() });
  });

  const getUsersEff = createEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>();
  getUsersEff.watch((async (e) => {
    e.preventDefault();
    try {
      const { data, loading, error } = await fetchUsersFx();
      if (!loading) {
        setUsersEff(data)
      }
      if (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
  }));

  return (
    <div className="App">
      <h1>Local State</h1>
      <div>
        <form>
          <input  value={username} onChange={e => setUsername(e.target.value)} type="text" />
          <input value={age} onChange={e => setAge(parseInt(e.target.value))} type="number" />
          <div className="btn">
            <button onClick={(e) => addUser(e)}>Create</button>
            <button onClick={(e) => getUsers(e)}>Get</button>
          </div>
        </form>
        <div>
          {users.map(user => (
            <div className="user">
              {user.id}. {user.username} {user.age}
            </div>
          ))}
        </div>
      </div>
      <h1>Effector State</h1>
      <div>
        <form>
          <input  value={usernameEff} onChange={e => setUsernameEff(e.target.value)} type="text" />
          <input value={ageEff} onChange={e => setAgeEff(parseInt(e.target.value))} type="number" />
          <div className="btn">
            <button onClick={(e) => addUserEff(e)}>Create</button>
            <button onClick={(e) => getUsersEff(e)}>Get</button>
          </div>
        </form>
        <div>
          {usersEff.map(userEff => (
            <div className="user">
              {userEff.id}. {userEff.username} {userEff.age}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
