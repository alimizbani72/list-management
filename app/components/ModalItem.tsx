"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

type ItemForm = {
  title: string;
  subtitle?: string;
};

const schema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  subtitle: z.string().max(240).optional(),
});
type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: ItemForm) => void;
  initial?: ItemForm;
  mode?: "create" | "edit";
};

export const ItemModal = ({
  open,
  onClose,
  onSubmit,
  initial,
  mode = "create",
}: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<ItemForm>({
    resolver: zodResolver(schema),
    defaultValues: initial || { title: "", subtitle: "" },
    mode: "onChange",
  });

  const submitHandler: SubmitHandler<ItemForm> = (data) => {
    onSubmit(data);
    onClose();
  };

  const closeHandler = () => {
    if (mode === "create") {
      reset({ title: "", subtitle: "" });
    }
    onClose();
  };
  const title = watch("title");
  const subtitle = watch("subtitle");

  const isButtonDisabled =
    mode === "create"
      ? !title || !subtitle
      : initial
        ? title === initial.title && subtitle === initial.subtitle
        : true;

  return (
    <Dialog open={open} onClose={closeHandler} fullWidth maxWidth="xs">
      <DialogTitle>
        {mode === "create" ? "Create Item" : "Edit Item"}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title"
                error={!!errors.title}
                helperText={errors.title?.message}
                inputProps={{ maxLength: 120 }}
                autoFocus
              />
            )}
          />
          <Controller
            name="subtitle"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Subtitle"
                multiline
                rows={3}
                error={!!errors.subtitle}
                helperText={errors.subtitle?.message}
                inputProps={{ maxLength: 240 }}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ mx: 4 }}>
        <Button onClick={closeHandler}>Cancel</Button>
        <Button
          onClick={handleSubmit(submitHandler)}
          variant="contained"
          disabled={isButtonDisabled}
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": { backgroundColor: "#222" },
          }}
        >
          {mode === "create" ? "Create" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
