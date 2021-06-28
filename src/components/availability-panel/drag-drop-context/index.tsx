import { FC, useState } from 'react';
import classNames from '@/components/availability-panel/drag-drop-context/styles.module.scss';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { dragDropProps } from '@/interfaces/availabilityPanel.type';
import fetch from '../../../helperFunctions/fetch';
import DroppableComponent from './DroppableComponent';

const DragDropcontext: FC<dragDropProps> = ({
  unAssignedTasks,
  idleMembers,
  reRenderComponent,
}) => {
  const [toogleSearch, setToogleSearch] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const onDragEnd = async (result: DropResult) => {
    if (result.combine && result.source.droppableId !== result.combine.droppableId) {
      setIsProcessing(true);
      try {
        const taskId = result.combine.droppableId === 'tasks'
          ? result.combine.draggableId
          : result.draggableId;
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/${taskId}`;
        const assignee = result.combine.droppableId === 'tasks'
          ? result.draggableId
          : result.combine.draggableId;
        const method = 'patch';
        const data = JSON.stringify({
          status: 'active',
          assignee,
        });
        const headers = {
          'Content-Type': 'application/json',
        };
        const response = await fetch({
          url,
          method,
          data,
          headers,
        });
        const message = (await response.status) === 204
          ? 'Sucessfully Assigned Task'
          : 'Something went wrong';
        alert(message);
        reRenderComponent();
      } catch (err) {
        alert(`${err}`);
        reRenderComponent();
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {isProcessing && (
        <div className={classNames.statusMessage}>Please wait...</div>
      )}
      {!isProcessing && (
      <div className={classNames.flexContainer}>
        <div>
          {unAssignedTasks.length === 0 ? (
            <div className={classNames.emptyArray}>
              <img src="ghost.png" alt="ghost" />
              No Tasks found
            </div>
          ) : (
            <div>
              <div className={classNames.searchBoxContainer}>
                <span
                  onClick={() => {
                    setToogleSearch(!toogleSearch);
                  }}
                  aria-hidden="true"
                  className={classNames.searchText}
                >
                  Search
                </span>
                {toogleSearch && <input />}
              </div>
              <div className={classNames.heading}> </div>
              <DroppableComponent
                droppableId="tasks"
                idleMembers={[]}
                unAssignedTasks={unAssignedTasks}
              />
            </div>
          )}
        </div>
        <div className={classNames.divider} />
        <div>
          {idleMembers.length === 0 ? (
            <div className={classNames.emptyArray}>
              <img src="ghost.png" alt="ghost" />
              No idle users Found
            </div>
          ) : (
            <div>
              <div className={classNames.searchBoxContainer}>
                <span />
                {toogleSearch && <input />}
              </div>
              <div className={classNames.heading}> </div>
              <div className={classNames.idleMember}>
                <DroppableComponent
                  droppableId="members"
                  idleMembers={idleMembers}
                  unAssignedTasks={[]}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </DragDropContext>
  );
};

export default DragDropcontext;
