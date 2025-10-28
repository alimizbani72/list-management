"use client";

import AddIcon from "@mui/icons-material/Add";
import { Button, Container, Grid, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";

import useToggleState from "@/hooks/ToggleState";
import { useItems } from "@/hooks/useItems";
import { Item } from "@/types";
import { ItemCard } from "./CardItem";
import { ConfirmDialog } from "./ConfirmDialog";
import { ItemModal } from "./ModalItem";

export default function ListSection() {
  const { items, create, update, remove } = useItems();
  const [modalOpen, toggleModal] = useToggleState(false);
  const [confirmOpen, toggleConfirmModal] = useToggleState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Item | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const openCreate = () => {
    setModalMode("create");
    setEditing(null);
    toggleModal();
  };

  const openEdit = (item: Item) => {
    setModalMode("edit");
    setEditing(item);
    toggleModal();
  };

  const createHandler = (payload: { title: string; subtitle?: string }) =>
    create({ title: payload.title, subtitle: payload.subtitle ?? "" });

  const updateHandler = (payload: { title: string; subtitle?: string }) => {
    if (!editing) return;
    update(editing.id, {
      title: payload.title,
      subtitle: payload.subtitle ?? "",
    });
  };

  const deleteRequesthandler = (id: string) => {
    setPendingDeleteId(id);
    toggleConfirmModal();
  };

  const confirmDeletehandler = () => {
    if (pendingDeleteId) remove(pendingDeleteId);
    toggleConfirmModal();
    setPendingDeleteId(null);
  };

  const sorted = useMemo(
    () =>
      items
        .slice()
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    [items]
  );

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography variant="h4">List of Cards</Typography>
        <Button
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": { backgroundColor: "#222" },
          }}
          startIcon={<AddIcon />}
          variant="contained"
          onClick={openCreate}
        >
          Create
        </Button>
      </Stack>
      {/* card Section  */}
      <Grid container spacing={2}>
        {sorted.length === 0 ? (
          <Grid item xs={12}>
            <Typography color="text.secondary">
              Opps! No items yet. Click Create to add your first item.
            </Typography>
          </Grid>
        ) : (
          sorted.map((item) => (
            <Grid item xs={12} sm={6} key={item.id}>
              <ItemCard
                item={item}
                onEdit={openEdit}
                onDelete={deleteRequesthandler}
              />
            </Grid>
          ))
        )}
      </Grid>
      {/* modal section  */}
      <ItemModal
        key={editing?.id}
        open={modalOpen}
        onClose={() => toggleModal()}
        onSubmit={modalMode === "create" ? createHandler : updateHandler}
        initial={
          editing
            ? { title: editing.title, subtitle: editing.subtitle }
            : undefined
        }
        mode={modalMode}
      />
      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => toggleConfirmModal()}
        onConfirm={confirmDeletehandler}
      />
    </Container>
  );
}
