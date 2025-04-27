"use client"
import React, { useState, useEffect } from 'react'
import Head from 'next/head';



const page = () => {
  const [title, settitle] = useState("")
  const [desc, setdesc] = useState("")
  const [mainTask, setmainTask] = useState([]);
  const [lastDeletedTask, setLastDeletedTask] = useState(null);


  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setmainTask(JSON.parse(savedTasks));  // Convert JSON string back to array
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(mainTask)); // Convert array to string
  }, [mainTask]);


  const submitHandler = (e) => {
    e.preventDefault()
    if (title.trim() === "") {
      alert("Title can't be empty.");
      return;
    }
  
    setmainTask([...mainTask, { title, desc }])

    settitle("")
    setdesc("")
    console.log(mainTask)
  }

  const deleteHandler = (i) => {
    const copyTask = [...mainTask];
    const deleted = copyTask.splice(i, 1)[0]; // 🔽 get the deleted task
    setmainTask(copyTask);
    setLastDeletedTask({ task: deleted, index: i }); // 🔽 store it
  };

  const undoHandler = () => {
    if (lastDeletedTask) {
      const copyTask = [...mainTask];
      copyTask.splice(lastDeletedTask.index, 0, lastDeletedTask.task);
      setmainTask(copyTask);
      setLastDeletedTask(null); // 🔽 clear the undo cache
    }
  };


  const toggleCompleteHandler = (i) => {
    const updatedTasks = [...mainTask];
    updatedTasks[i].completed = !updatedTasks[i].completed;
    setmainTask(updatedTasks);
  };

  const toggleEditHandler = (i) => {
    const updatedTasks = [...mainTask];
    updatedTasks[i].isEditing = true;
    updatedTasks[i].editTitle = updatedTasks[i].title;
    updatedTasks[i].editDesc = updatedTasks[i].desc;
    setmainTask(updatedTasks);
  };

  const handleEditChange = (i, field, value) => {
    const updatedTasks = [...mainTask];
    updatedTasks[i][field] = value;
    setmainTask(updatedTasks);
  };

  const saveEditHandler = (i) => {
    const updatedTasks = [...mainTask];
    updatedTasks[i].title = updatedTasks[i].editTitle;
    updatedTasks[i].desc = updatedTasks[i].editDesc;
    updatedTasks[i].isEditing = false;
    setmainTask(updatedTasks);
  };

  const clearAllHandler = () => {
    setmainTask([]);
    localStorage.removeItem('tasks');
  };


  let renderTask = <h2 className='flex justify-center font-bold text-2xl poppins'>No Task Available</h2>

  if (mainTask.length > 0) {

    renderTask = mainTask.map((t, i) => {
      return (
        <li key={i} className='mb-5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center justify-between w-2/3'>
              {t.isEditing ? (
                <div className='flex flex-col w-full gap-2'>
                  <input
                    type='text'
                    value={t.editTitle}
                    onChange={(e) => handleEditChange(i, 'editTitle', e.target.value)}
                    className='border rounded px-2 py-1'
                  />
                  <input
                    type='text'
                    value={t.editDesc}
                    onChange={(e) => handleEditChange(i, 'editDesc', e.target.value)}
                    className='border rounded px-2 py-1'
                  />
                </div>
              ) : (
                <div className='flex flex-col'>
                  <h5 className={`text-2xl font-semibold ${t.completed ? 'line-through text-gray-400' : ''}`}>{i+1}.&nbsp;&nbsp;{t.title}</h5>
                  <h6 className={`text-lg font-medium ${t.completed ? 'line-through text-gray-400' : ''}`}>{t.desc}</h6>
                </div>
              )}
            </div>

            <div className='flex gap-2'>
              {t.isEditing ? (
                <button
                  onClick={() => saveEditHandler(i)}
                  className='bg-blue-500 text-white rounded-2xl font-bold px-4 py-2'
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => toggleEditHandler(i)}
                  className=' rounded-2xl bg-yellow-400 text-black font-bold px-4 py-2'
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => toggleCompleteHandler(i)}
                className={`rounded-2xl font-bold px-4 py-2 ${t.completed ? 'bg-green-600 text-white' : 'bg-gray-300 text-black'}`}
              >
                {t.completed ? 'Completed' : 'Mark Completed'}
              </button>

              <button
                onClick={() => deleteHandler(i)}
                className='bg-red-400 text-white rounded-2xl font-bold px-4 py-2'
              >
                Delete
              </button>
            </div>
          </div>
        </li>



      );
    });
  }
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/png" href="/sticky-note.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ToDo List App</title>
      </Head>
      <div className='bg-image-gradient h-screen'>

        <h1 className='bg-[#008296] text-white p-5 text-2xl font-bold text-center poppins flex items-center justify-center gap-2'> <img src='/sticky-note.png' className='h-10 w-10 ' /> ToDo <span className='playwrite text-3xl'> List</span></h1>

        <form onSubmit={submitHandler}>
          <div className='flex justify-center'>
            <input type='text' className=' text-black bg-slate-200 rounded-2xl text-2xl border-zinc-800 border-4 m-5 px-4 py-2' placeholder='Enter Title' value={title} onChange={(e) => {
              settitle(e.target.value)
            }} />
          
            <input type='text' className=' text-black bg-slate-200 rounded-2xl text-2xl border-zinc-800 border-4 m-5 px-4 py-2' placeholder='Add Description' value={desc} onChange={(e) => {
              setdesc(e.target.value)
            }} />
          </div>
          <div className='flex justify-center'>
            <button className=' bg-[#005663] hover:bg-[#51a8b6] text-white px-4 py-3 text-2xl font-bold rounded-3xl m-5 border border-white'>Add Task</button>
          </div>
        </form>
        <hr />
        <div className='p-8 m-15 mt-5 rounded-4xl bg-slate-200'>
          <button
            onClick={clearAllHandler}
            className='bg-red-600 text-white font-bold px-4 py-2 rounded mb-4 ml-8'
          >
            Clear All
          </button>
          <button
            onClick={undoHandler}
            className='bg-green-500 text-white font-bold px-4 py-2 rounded mb-4 ml-4'
          >
            Undo Delete
          </button>
          <div className='task-container'>
          <ul>
            {renderTask}
          </ul>
          </div>
        </div>
      </div>
      <footer className="footer bg-black text-white text-center p-4">
      © 2025 ToDo List App | Hamzah Imtiaz | All rights reserved
    </footer>
    </>
  )
}

export default page

