import React from 'react';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import { styled } from '@mui/system';

import TextFieldDatePicker from '../containers/TextFieldDatePicker';
import EditionRow from '../containers/EditionRow';

const Wrapper = styled('article')({
    height: '90%',
});

const AdminPanelComponent = ({
    isLoading,
    currentlyEditedFoodId,
    foodsList,
    addNewFood,
    deleteFood,
    editFood,
    submitFoodChanges,
    discardFoodChanges,
}) => {
    return (
        <Wrapper>
            <form onSubmit={addNewFood}>
                <TableContainer
                    component={Paper}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell>
                                    Consumed at
                                </TableCell>
                                <TableCell>
                                    Kcal
                                </TableCell>
                                <TableCell>
                                    Price
                                </TableCell>
                                <TableCell>
                                    Username
                                </TableCell>
                                <TableCell>
                                    Operation
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <TextField
                                        required
                                        id="name"
                                        label="Name"
                                        variant="standard"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextFieldDatePicker
                                        required
                                        id="consumedAt"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        required
                                        type="number"
                                        id="kcal"
                                        label="Kcal"
                                        variant="standard"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        required
                                        type="number"
                                        id="price"
                                        label="Price"
                                        variant="standard"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        required
                                        type="text"
                                        id="username"
                                        label="Username"
                                        variant="standard"
                                    />
                                </TableCell>
                                <TableCell>
                                    <LoadingButton
                                        size="small"
                                        type="submit"
                                        loading={isLoading}
                                        variant="text"
                                    >
                                        <AddIcon />
                                    </LoadingButton>
                                </TableCell>
                            </TableRow>
                            {foodsList.map(food => (
                                <React.Fragment key={food.id}>
                                    {food.id === currentlyEditedFoodId && (
                                        <EditionRow
                                            isLoading={isLoading}
                                            food={food}
                                            submitFoodChanges={submitFoodChanges}
                                            discardFoodChanges={discardFoodChanges}
                                        />
                                    )}
                                    {food.id !== currentlyEditedFoodId && (
                                        <TableRow key={food.id}>
                                            <TableCell>
                                                {food.name}
                                            </TableCell>
                                            <TableCell>
                                                {(new Date(food.consumedAt)).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                {food.kcal}
                                            </TableCell>
                                            <TableCell>
                                                {food.price}
                                            </TableCell>
                                            <TableCell>
                                                {food.username}
                                            </TableCell>
                                            <TableCell>                                            
                                                <LoadingButton
                                                    size="small"
                                                    loading={isLoading}
                                                    variant="text"
                                                    onClick={() => deleteFood(food.id)}
                                                >
                                                    <RemoveIcon />
                                                </LoadingButton>
                                                <LoadingButton
                                                    size="small"
                                                    loading={isLoading}
                                                    variant="text"
                                                    onClick={() => editFood(food.id)}
                                                >
                                                    <EditIcon />
                                                </LoadingButton>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </form>
        </Wrapper>
    );
}

export default AdminPanelComponent;