"use client";

import { ITask } from "@/types/tasks";
import { FormEventHandler, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { deleteTodo, editTodo, toogleCompleted } from "@/api";
import ToggleButton from './ToggleButton';
import toast from 'react-hot-toast';

interface TaskProps {
  task: ITask;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const router = useRouter();
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<string>(task.text);

  const handleSubmitEditTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await editTodo({
      id: task.id,
      text: taskToEdit,
      isCompleted: task.isCompleted,
    });
    setOpenModalEdit(false);
    toast.success('Task Updated Successfully');
    router.refresh();
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTodo(id);
    setOpenModalDeleted(false);
    toast.success('Task Deleted Successfully');
    router.refresh();
  };

  const handleToggleComplete = async (id: string, 
    isCompleted: boolean
    ) => {
    await toogleCompleted(id, isCompleted);
    router.refresh();
  };




  return (
    <tr key={task.id}>
      {/* checkbox when clicked will line through the text name with status isCompleted true  */}
      <td className = 'w-1/12'
      >
        <input type='checkbox' className='checkbox'
          checked={task.isCompleted}
          onChange={() => {
            if (task.isCompleted) {
              handleToggleComplete(task.id, false);
            } else {
              handleToggleComplete(task.id, true);
          }
        }}
        />
      </td>

      {/* <td className='w-full'>{task.text}</td> */}
      <td className={`w-full ${task.isCompleted ? 'line-through' : ''}`
      }
      >{task.text}</td>
      <td className='flex gap-5'>
        <FiEdit
          onClick={() => setOpenModalEdit(true)}
          cursor='pointer'
          className='text-blue-500'
          size={25}
        />
        <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <form onSubmit={handleSubmitEditTodo}>
            <h3 className='font-bold text-lg'>Edit task</h3>
            <div className='modal-action'>
              <input
                value={taskToEdit}
                onChange={(e) => setTaskToEdit(e.target.value)}
                type='text'
                placeholder='Type here'
                className='input input-bordered w-full'
              />
            </div>
            <div className='modal-action'>
            <h3 className='font-bold text-lg'>{
                task.isCompleted ? 'This task is completed' : 'This task is not completed'
             }</h3>
             <ToggleButton
              isCheck={task.isCompleted}
              onChange={(value) => {
                if (task.isCompleted) {
                  handleToggleComplete(task.id, false);
                } else {
                  handleToggleComplete(task.id, true);
                }
              }}
            />
              </div>
            <div className='modal-action'>
              <button type='submit' className='btn'>
                Submit
              </button>
            </div>
          </form>
        </Modal>
        <FiTrash2
          onClick={() => setOpenModalDeleted(true)}
          cursor='pointer'
          className='text-red-500'
          size={25}
        />
        <Modal modalOpen={openModalDeleted} setModalOpen={setOpenModalDeleted}>
          <h3 className='text-lg'>
            Are you sure, you want to delete this task?
          </h3>
          <div className='modal-action'>
            <button onClick={() => handleDeleteTask(task.id)} className='btn'>
              Yes
            </button>
          </div>
        </Modal>
      </td>
    </tr>
  );
};

export default Task;
