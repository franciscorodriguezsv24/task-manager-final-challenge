import { Button } from "../../ui/button/Button";
import styles from "./editTask.module.scss";
import { createPortal } from "react-dom";
import { Modal } from "../../ui/modal/Modal";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetLabelsQuery,
  useGetPointEstimatesQuery,
  useGetStatusQuery,
  useGetUsersQuery,
} from "../../../generated/graphql";
import { pointEstimate } from "../../../hooks/PointEstimate";
import { tagToValue } from "../../../hooks/TagValue";
import { ListBox } from "../../ui/listBox/ListBox";
import { ListAvatar } from "../../ui/listAvatar/ListAvatar";
import { ListCheckBox } from "../../ui/listChexkbox/ListCheckBox";
import { CalendarC } from "../../ui/calendar/Calendar";
import { UseMediaQuery } from "../../../hooks/UseMediaQuery";
import { RiCloseLargeLine } from "@remixicon/react";
import useCardStore from "../../../store/useEditManager";
import { gql, useMutation } from "@apollo/client";
import { EDIT_TASK } from "../../../api/graphql/queries.graphql";
import { useCustomToast } from "../../../hooks/UseCustomToast";
import { LoadingComponent } from "../../ui/loading/Loading";
import { columnName } from "../../../hooks/columnName";

const formSchema = z.object({
  taskName: z
    .string()
    .min(3, "Add a validate task's name")
    .max(30, "the name is to long"),
  pointsTask: z.string().min(1, "this field is required"),
  assignee: z.string().min(1, "this field is required"),
  label: z.array(z.string()).min(1, "This field is required"),
  dueDate: z.date().min(1, "this field is required"),
  status: z.string().min(1, "this field is required"),
});

type FormData = z.infer<typeof formSchema>;

export const EditTask = ({ onClose }: { onClose: () => void }) => {
  const { showToast } = useCustomToast();
  const isMobile = UseMediaQuery("(max-width: 880px)");
  const { selectedCard } = useCardStore();

  const convertToDate = (dateValue: Date | undefined): Date | undefined => {
    if (!dateValue) return undefined;
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === "string") return new Date(dateValue);
    return undefined;
  };

  const {
    reset,
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: selectedCard?.name || "",
      pointsTask: selectedCard?.pointEstimate || "",
      assignee: selectedCard?.assigneeId?.id || "",
      label: selectedCard?.tags || [],
      dueDate: convertToDate(selectedCard?.dueDate),
      status: selectedCard?.status || "",
    },
  });

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
    data: dataStatus,
    loading: isLoadingStatus,
    error: errorStatus,
  } = useGetStatusQuery();

  const status = dataStatus?.__type?.enumValues?.map((item, index) => ({
    id: String(index + 1),
    name: columnName[item.name],
    value: item.name,
  }));

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

  const [updateTask, { loading: isLoadingEdit, error: errorEdit }] =
    useMutation(EDIT_TASK, {
      update(cache, { data }) {
        if (!data?.updateTask) return;

        cache.modify({
          fields: {
            tasks(existingTaskRefs = [], { readField }) {
              return existingTaskRefs.map((taskRef: { __ref: string }) => {
                const id = readField<string>("id", taskRef);

                if (id === data.updateTask.id) {
                  return cache.writeFragment({
                    data: data.updateTask,
                    fragment: gql`
                      fragment UpdatedTask on Task {
                        id
                        name
                        status
                        dueDate
                        assignee {
                          id
                          fullName
                        }
                        __typename
                      }
                    `,
                  });
                }
                return taskRef;
              });
            },
          },
        });
      },
    });

  const onSubmit = async (data: FormData) => {
    try {
      await updateTask({
        variables: {
          input: {
            assigneeId: data.assignee,
            dueDate: data.dueDate,
            id: selectedCard?.id,
            name: data.taskName,
            pointEstimate: data.pointsTask,
            status: data.status,
            tags: data.label,
          },
        },
      });

      showToast("success", "Your task has been updated successfully");
      onClose();
      reset();
    } catch (error) {
      console.error(error);
      return showToast(
        "error",
        `Failed to update task. Please try again ${errorEdit?.message}.`,
      );
    }
  };

  if (isLoadingEdit)
    return (
      <div className={styles.spinnerContainer}>
        <LoadingComponent />
      </div>
    );

  if (isLoadingUsers || isLoadingEstimate || isLoadingLabels || isLoadingStatus)
    return <p>Loading...</p>;

  if (errorUsers || errorEstimate || errorLabel || errorStatus)
    return <p>Error foundata</p>;

  return createPortal(
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
                render={({ field, fieldState }) => (
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
                  </div>
                )}
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
                name="status"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <ListBox
                      data={status || []}
                      displayKey="name"
                      valueKey="value"
                      placeholder="Status"
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
                onClose();
              }}
            >
              {isMobile ? <RiCloseLargeLine /> : "Cancel"}
            </Button>
            <Button
              variant={isMobile ? "defaul" : "secondary"}
              type="submit"
              disabled={!isValid || isLoadingEdit}
              className={styles.buttonSend}
            >
              Edit
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Container>
    </div>,
    document.getElementById("modal-root")!,
  );
};
