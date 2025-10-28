import { Item } from "@/types";
import { formatDate } from "@/utils/dateFormat";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";

type Props = {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
};

export const ItemCard = ({ item, onEdit, onDelete }: Props) => {
  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography variant="caption" color="text.secondary">
          {formatDate(item.createdAt)}
        </Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {item.subtitle}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton aria-label="edit" onClick={() => onEdit(item)}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => onDelete(item.id)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
