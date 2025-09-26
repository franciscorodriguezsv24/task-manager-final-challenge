import { useEffect, useState } from "react";
import { Modal } from "../../ui/modal/Modal";
import { RiAddCircleFill, RiAddFill, RiCloseLargeLine } from "@remixicon/react";
import { Button } from "../../ui/button/Button";
import styles from "./createTask.module.scss";
import { createPortal } from "react-dom";
import { ListBox } from "../../ui/listBox/ListBox";
import { ListAvatar } from "../../ui/listAvatar/ListAvatar";
import { ListCheckBox } from "../../ui/listChexkbox/ListCheckBox";
import { CalendarC } from "../../ui/calendar/Calendar";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { CREATE_TASK } from "../../../api/graphql/queries.graphql";
import {
  Status,
  useGetLabelsQuery,
  useGetPointEstimatesQuery,
  useGetUsersQuery,
} from "../../../generated/graphql";
import { tagToValue } from "../../../hooks/TagValue";
import { pointEstimate } from "../../../hooks/PointEstimate";
import { UseMediaQuery } from "../../../hooks/UseMediaQuery";
import { useCustomToast } from "../../../hooks/UseCustomToast";

const formSchema = z.object({
  taskName: z
    .string()
    .min(3, "Add a validate task's name")
    .max(30, "The name is to long"),
  pointsTask: z.string().min(1, "this field is required"),
  assignee: z.string().min(1, "this field is required"),
  label: z.array(z.string()).min(1, "This field is required"),
  dueDate: z.date().min(1, "this field is required"),
});

type FormData = z.infer<typeof formSchema>;

export const CreateTask = () => {
  const isMobile = UseMediaQuery("(max-width: 880px)");
  const { showToast } = useCustomToast();

  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);

  const {
    loading: isLoadingUsers,
    data: dataUsers,
    error: errorUsers,
  } = useGetUsersQuery();

  const {
    loading: isLoadingEstimate,
    data: dataEstimate,
    error: errorEstimate,
  } = useGetPointEstimatesQuery();

  const {
    data: dateLabels,
    loading: isLoadingLabels,
    error: errorLabel,
  } = useGetLabelsQuery();

  const {
    reset,
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
      pointsTask: "",
      assignee: "",
      label: [],
      dueDate: undefined,
    },
  });

  const [createTask, { loading: isLoading, error: errorCreate }] = useMutation(
    CREATE_TASK,
    {
      update(cache, { data }) {
        if (!data?.createTask) return;
        cache.modify({
          fields: {
            tasks(existingTasks = []) {
              return [{ ...data.createTask, isNew: true }, ...existingTasks];
            },
          },
        });
      },
    },
  );

  useEffect(() => {
    if (isLoadingEstimate || isLoadingLabels || isLoadingUsers) {
      setIsLoadingContent(true);
    } else {
      setIsLoadingContent(false);
    }
  }, [isLoadingEstimate, isLoadingLabels, isLoadingUsers]);

  if (errorUsers || errorEstimate || errorLabel) return <p>Error foundata</p>;

  const onSubmit = async (data: FormData) => {
    try {
      await createTask({
        variables: {
          input: {
            assigneeId: data.assignee,
            dueDate: data.dueDate,
            name: data.taskName,
            pointEstimate: data.pointsTask,
            status: Status.Backlog,
            tags: data.label,
          },
        },
      });
      showToast("success", "Your task has been created successfully");
      setIsShowModal(false);
      reset();
    } catch (error) {
      console.error(error);
      return showToast(
        "error",
        `Failed to create task. Please try again ${errorCreate?.message}.`,
      );
    }
  };

  const order = Object.keys(pointEstimate);

  const points =
    dataEstimate?.__type?.enumValues
      ?.map((item, index) => ({
        id: String(index + 1),
        name: pointEstimate[item.name],
        value: item.name,
      }))
      .sort((a, b) => order.indexOf(a.value) - order.indexOf(b.value)) || [];

  const labels =
    dateLabels?.__type?.enumValues?.map((item, index) => ({
      id: String(index + 1),
      name: tagToValue[item.name],
      value: item.name,
    })) || [];

  return (
    <div>
      <Button
        variant={isMobile ? "default" : "secondary"}
        className={styles.buttons}
        onClick={() => setIsShowModal(true)}
        disabled={isLoadingContent}
      >
        {isMobile ? (
          <div className={styles.containerNewTask}>
            <RiAddCircleFill />
            Add Task
          </div>
        ) : (
          <RiAddFill />
        )}
      </Button>

      {isShowModal &&
        createPortal(
          <div className={styles.container}>
            <Modal.Container className={styles.modalContainer}>
              <form
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
                className={styles.formContainer}
              >
                <div className={styles.actionContainer}>
                  <Modal.Header className={styles.modalHeader}>
                    <label htmlFor="taskNameInput" style={{ display: "none" }}>
                      task title
                    </label>
                    <Controller
                      name="taskName"
                      control={control}
                      render={({ field, fieldState }) => {
                        const isTooLong = field.value.length > 30;
                        return (
                          <div className={styles.inputContainer}>
                            <input
                              id="taskNameInput"
                              placeholder="Task Title"
                              value={field.value || ""}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              className={styles.inputNewTask}
                            />
                            {fieldState.error && (
                              <span style={{ color: "red" }}>
                                {fieldState.error.message}
                              </span>
                            )}
                            {isTooLong && !fieldState.error && (
                              <span className={styles.errorInput}>
                                The task name cannot exceed 30 characters
                              </span>
                            )}
                          </div>
                        );
                      }}
                    />
                  </Modal.Header>

                  <Modal.Body className={styles.modalBody}>
                    <Controller
                      name="pointsTask"
                      control={control}
                      render={({ field, fieldState }) => (
                        <div>
                          <ListBox
                            data={points}
                            displayKey="name"
                            valueKey="value"
                            placeholder="Estimate"
                            value={field.value}
                            onChange={field.onChange}
                          />
                          {fieldState.error && (
                            <span style={{ color: "red" }}>
                              {fieldState.error.message}
                            </span>
                          )}
                        </div>
                      )}
                    />

                    <Controller
                      name="assignee"
                      control={control}
                      render={({ field, fieldState }) => (
                        <div>
                          <ListAvatar
                            data={dataUsers?.users || []}
                            displayKey="fullName"
                            valueKey="id"
                            placeholder="Assignee"
                            value={field.value}
                            onChange={field.onChange}
                          />
                          {fieldState.error && (
                            <span style={{ color: "red" }}>
                              {fieldState.error.message}
                            </span>
                          )}
                        </div>
                      )}
                    />

                    <Controller
                      name="label"
                      control={control}
                      render={({ field, fieldState }) => (
                        <div>
                          <ListCheckBox
                            data={labels}
                            displayKey="name"
                            valueKey="value"
                            placeholder="Label"
                            value={field.value}
                            onChange={field.onChange}
                          />
                          {fieldState.error && (
                            <span style={{ color: "red" }}>
                              {fieldState.error.message}
                            </span>
                          )}
                        </div>
                      )}
                    />
                    <Controller
                      name="dueDate"
                      control={control}
                      render={({ field, fieldState }) => (
                        <div>
                          <CalendarC
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Due Date"
                          />
                          {fieldState.error && (
                            <span style={{ color: "red" }}>
                              {fieldState.error.message}
                            </span>
                          )}
                        </div>
                      )}
                    />
                  </Modal.Body>
                </div>
                <Modal.Footer className={styles.modalFooter}>
                  <Button
                    type="button"
                    className={styles.closeButton}
                    onClick={() => {
                      setIsShowModal(false);
                    }}
                  >
                    {isMobile ? <RiCloseLargeLine /> : "Cancel"}
                  </Button>
                  <Button
                    variant={isMobile ? "defaul" : "secondary"}
                    type="submit"
                    disabled={!isValid || isLoading}
                    className={styles.buttonSend}
                  >
                    Create
                  </Button>
                </Modal.Footer>
              </form>
            </Modal.Container>
          </div>,
          document.getElementById("modal-root")!,
        )}
    </div>
  );
};
