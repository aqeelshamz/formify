"use client";
import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const Modal = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    console.log("Button clicked");
    document.getElementById("my_modal_1").showModal();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}

      <button
        className="btn mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg "
        onClick={openModal}
      >
        + New Form
      </button>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Creatse form</h3>
          <div className="flex justify-center">
            {" "}
            <button className="btn btn-square btn-outline">
              <FiEdit className="h-6 w-6" />
            </button>{" "}
            <button className="btn btn-square btn-outline">
              <FiEdit className="h-6 w-6" />
            </button>
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Modal;
