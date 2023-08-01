"use client";
import { ITask } from "@/types/tasks";
import React from "react";
import Task from "./Task";
import { useRouter } from "next/navigation";
import { AiOutlineDelete } from "react-icons/ai";
import { FormEventHandler, useState } from "react";
import Modal from "./Modal";
import { deleteTodo } from "@/api";
import toast from 'react-hot-toast';

interface TodoListProps {
  tasks: ITask[];
}

const TodoList: React.FC<TodoListProps> = ({ tasks }) => {
  const router = useRouter();
  const [openModalDeletedCompleted, setOpenModalDeletedCompleted] = useState<boolean>(false);
 const handleDeleteAllCheckedTask = async () => {
    tasks.map((task) => {
      if (task.isCompleted) {
        deleteTodo(task.id);
      }
    }
    );
    setOpenModalDeletedCompleted(false);
    toast.success('All Tasks Deleted Successfully');
    router.refresh();
  };
  return (
    <div className='overflow-x-auto'>
      <table className='table w-full'>
        {/* head */}
        <thead>
          <tr>
            <th>Completed</th>
            <th>Tasks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </tbody>
      </table>
      <div className="text-center">
      <button
        onClick={() => setOpenModalDeletedCompleted(true)}
        className='btn btn-gray btn-sm w-1/8'
      >
        Delete All Completed Task <AiOutlineDelete className='ml-2' size={18} />
      </button>
      </div>
      <Modal modalOpen={openModalDeletedCompleted} setModalOpen={setOpenModalDeletedCompleted}>
        <h3 className='text-lg'>
          Are you sure, you want to delete all completed task?
        </h3>
        <div className='modal-action'>
          <button onClick={() => handleDeleteAllCheckedTask()} className='btn'>
            Yes
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default TodoList;
