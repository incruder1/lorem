import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Link,
} from "@mui/material";
import {
  viewJobStyle,
  applyBtn,
  viewJobText,
} from "../styles/jobDialougeStyle";
import ElectricBolt from "@mui/icons-material/ElectricBolt";

const JobDialougeBox = ({ jobDescription, jdLink }) => {
  const [open, setOpen] = useState(false);

  //function to handle open and close state of dialouge box

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={viewJobStyle}>
      <Button variant="text" onClick={handleClickOpen} sx={viewJobText}>
        View Job
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle>Job Description</DialogTitle>
        <DialogContent>
          {" "}
          <Typography variant="body1">{jobDescription}</Typography>
        </DialogContent>
        <DialogActions>
          <Link href={jdLink} target="_blank" underline="none">
            <Button varinat="contained" sx={applyBtn}>
              <ElectricBolt sx={{ color: "yellow" }} /> Easy Apply
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobDialougeBox;
