import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const ColorScheme: React.FC = () => {
  return (
    <FormControl>
      <InputLabel>Color Scheme</InputLabel>
      <Select defaultValue="dark">
        <MenuItem value="dark">Dark</MenuItem>
        <MenuItem value="light">Light</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ColorScheme;
