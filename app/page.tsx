'use client'
import { useState, useEffect } from 'react'
import Header from "@components/Header"
import AddTask from "@components/AddTask"
import NoTask from "@components/NoTask"
import { Flex, Spinner } from '@chakra-ui/react';
import { ITask } from '@types';
import Task from '@components/Task'
import Loading from '@components/Loading'
// const reducer = (state, action) => {
//   switch(action.type) {
//     case 'ADD_TASK':
//       return {
//         ...state,
//         tasks: [...state.tasks, action.payload]
//       };
//     case 'REMOVE_TASK': 
//       return {
//         ...state,
//         tasks: state.tasks.filter(task => task.id !== action.payload);
//       };
//     default: 
//       return state;  
//   }
// }

export default function Home() {
  // const [state, dispatch] = useReducer(reducer, {tasks : myTodo});
  // const [currentTask, setCurrentTask] = useState('');
  const [task, setTask] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleCreateTask = async() => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/task/new", {
        method: 'POST',
        body: JSON.stringify({
          task
        })
      })
      
      if(response.ok) {
        setTask('')
        await fetchTasks()
      } else {
        console.log('error')
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  const fetchTasks = async() => {
    try {
      const response = await fetch("/api/task/all")
      const data = await response.json()
      setAllTasks(data)
      setIsLoading(false)
    } catch (error) {
      console.log(error);
    }
  }

  const handleCompleteTask = async(id: string) => {
    try {
      const response = await fetch(`api/task/complete/${id}`, {
        method: "PATCH"
      })

      if(response.ok) {
        await fetchTasks()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteTask = async(id: string) => {
    try {
      const response = await fetch(`/api/task/delete/${id}`, {
        method: "DELETE"
      })

      if(response.ok) {
        setAllTasks((prevTasks) => prevTasks.filter((task: ITask) => task._id !== id))
      } else {
        console.log("error")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [])

  return (
    <>
      <Header />
      <AddTask task={task} setTask={setTask} handleCreateTask={handleCreateTask} />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Flex direction="column" p="2rem">
            {allTasks.length > 0 ? 
              allTasks.map((individualTask: ITask) => (
                <Task 
                  key={individualTask._id} 
                  individualTask={individualTask}
                  handleCompleteTask={handleCompleteTask}
                  handleDeleteTask={handleDeleteTask}
                />
              )) : (
                <NoTask />
              )
            }
          </Flex>
        </>
      )}
    </>
  )
}
