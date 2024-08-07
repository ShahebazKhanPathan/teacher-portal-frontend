import { Alert, AlertIcon, Button, FormControl, FormLabel, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserCircle } from "react-icons/fa";
import apiClient from "../services/apiClient";

// Create studnent schema
interface Student{
    name: string,
    subject: string,
    marks: number
}

const Dashboard = () => {

    // Customer hook for using modal
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    // Handle states
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Student>();
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState("");
    const [error, setError] = useState("");

     // Handle form submit
    const onSubmit = async (data: Student) => {

        // Reset alerts and loader
        setLoader(true);
        setAlert("");
        setError("");
        const { name, subject, marks } = data;
        
        // API call for adding new student
        await apiClient.post("/api/student", { name: name, subject: subject, marks: marks })
            .then(({ data }) => {
                reset();
                setLoader(false);
                setAlert(data);
                setTimeout(() => {
                   setAlert(""); 
                }, 5000);
            })
            .catch((err) => {
                setLoader(false);
                setTimeout(() => {
                    setError("");
                }, 10000);
                
                if (err.response) {
                    setError(err.response.data); 
                }
                else {
                    setError(err.message);
                }
                
            });
    };
    
    return (
        <Grid templateColumns={"repeat(12, 1fr)"} gap={5} padding={10} alignItems={"center"}>
            <GridItem colSpan={10} textAlign={"center"} rowSpan={1}>
                <Text fontSize="xxx-large">Dashboard</Text>
            </GridItem>
            <GridItem colSpan={2}>
                <Button leftIcon={<FaUserCircle />} size={"lg"} variant={"ghost"}>Logout</Button>
            </GridItem>
            <GridItem>
                <Button onClick={onOpen} color={"white"} backgroundColor={"black"}>Add new student</Button>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                        <ModalContent>
                            <ModalHeader>
                                {alert &&
                                <Alert fontSize={"smaller"} status={"success"} marginBottom={4}>
                                    <AlertIcon />
                                    {alert}
                                </Alert>
                                }
                                {error &&
                                    <Alert fontSize={"smaller"} status={"error"} marginBottom={4}>
                                        <AlertIcon />
                                        {error}
                                    </Alert>
                                }
                                Create new student
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <FormControl>
                                    <FormLabel>Name</FormLabel>
                                    <Input
                                        {...register("name",
                                            {
                                                required: "Name is required",
                                                minLength: { value: 3, message: "Name must be atleast 3 characters long." }
                                            })
                                        }
                                        placeholder='Name'
                                    />
                                    {errors.name && <Text color={"red"}>{errors.name.message}</Text>}
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel>Subject</FormLabel>
                                    <Input
                                        {...register("subject",
                                            {
                                                required: "Subject is required",
                                                minLength: { value: 3, message: "Name must be atleast 3 characters long." }
                                            })
                                        }
                                        placeholder='Subject'
                                    />
                                    {errors.subject && <Text color={"red"}>{errors.subject.message}</Text>}
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel>Marks</FormLabel>
                                    <Input
                                        {...register("marks",
                                            {
                                                required: "Marks are required",
                                            })
                                        }
                                        placeholder='Marks'
                                    />
                                    {errors.marks && <Text color={"red"}>{errors.marks.message}</Text>}
                                </FormControl>
                            </ModalBody>

                            <ModalFooter>
                                <Button isLoading={loader} type="submit" colorScheme='blue' mr={3}>
                                    Save
                                </Button>
                                <Button onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </form>
                </Modal>
            </GridItem>
        </Grid>
    )
}

export default Dashboard;