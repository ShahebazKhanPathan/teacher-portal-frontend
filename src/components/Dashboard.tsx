import { Alert, AlertIcon, Button, FormControl, FormLabel, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserCircle } from "react-icons/fa";
import apiClient from "../services/apiClient";
import checkTokenExpiry from "../utils/tokenExpiry";
import logOut from "../utils/logOut";

// Create student schema
interface Student{
    _id: string,
    name: string,
    subject: string,
    marks: number
}

// Get token
const token = localStorage.getItem("auth-token");

// API for checking token expiry
const expiry = async () => {
    return await checkTokenExpiry();
}

const Dashboard = () => {

    const result = expiry();

    // Redirect to homepage if token is not found or expired
    if (!result || !token) location.href = "/";
        
    else {
        // Customer hook for using modal
        const { isOpen, onOpen, onClose } = useDisclosure();
        const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
    
        // Handle states
        const { register, handleSubmit, formState: { errors }, reset } = useForm<Student>();
        const [loader, setLoader] = useState(false);
        const [alert, setAlert] = useState("");
        const [deleteError, setDeleteError] = useState("");
        const [deleteAlert, setDeleteAlert] = useState("");
        const [error, setError] = useState("");
        const [students, setStudents] = useState<Student[]>([]);
        const [student, setStudent] = useState<Student>();
        const [sid, setSid] = useState('');

        // handle input change
        const handleChange = (event) => setStudent(event.target.value);

        // Handle form submission
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
                    getStudents();
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

        // Handle edit form submission
        const onSubmitEdit = async (data: Student) => {

            // Reset alerts and loader
            setLoader(true);
            setAlert("");
            setError("");
            const { name, subject, marks } = data;
        
            // API call for updating student
            await apiClient.put("/api/student", { name: name, subject: subject, marks: marks, id: sid })
                .then(({ data }) => {
                    reset();
                    setLoader(false);
                    onCloseEdit();
                    setAlert(data);
                    setTimeout(() => {
                        setAlert("");
                    }, 5000);
                    getStudents();
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

        // Handle new student modal
        const onNewStudent = () => {
            reset();
            onOpen();
        }

        // Handle edit student modal
        const onEditStudent = (student: Student) => {
            setStudent(student);
            setSid(student._id);
            onOpenEdit();
        }

        // API call for deleting student
        const onDelete = async (id: String) => {
            await apiClient.delete("/api/student/" + id)
                .then(({ data }) => {
                    getStudents();
                    setDeleteAlert(data);
                    setTimeout(() => {
                        setDeleteAlert("");
                    }, 6000);
                })
                .catch((err) => {
                    setDeleteError(err.message);
                });
        }

        // API call for getting students
        const getStudents = async () => {
            await apiClient.get("/api/student")
                .then(({ data }) => setStudents(data))
                .catch((err) => console.log(err));
        }

        // Call students API whenever component renders
        useEffect(() => {
            getStudents();
        }, []);
    
        // Render dasbhboard component
        return (
            <Grid
                templateColumns={{base: "repeat(3, 1fr)"}}
                gap={5}
                padding={{ base: 5, sm: 5, md: 8, lg: 12, xl: 10}}
                alignItems={"center"}
            >
                <GridItem colSpan={{base: 2}} textAlign={"center"} rowSpan={1}>
                    <Text fontSize={{base: "x-large", sm: "x-large", md: "xx-large", lg: "xx-large", xl: "xxx-large"}}>Dashboard</Text>
                </GridItem>
                <GridItem colSpan={{ base: 1}}>
                    <Button size={{ base: "sm", sm: "sm", md: "md", lg: "md", xl: "lg"}} onClick={logOut} leftIcon={<FaUserCircle />} size={"lg"} variant={"ghost"}>Logout</Button>
                </GridItem>
                <GridItem colSpan={{base: 3}}>
                    <Button size={{ base: "sm", sm: "sm", md: "md", lg: "md", xl: "lg"}} onClick={onNewStudent} color={"white"} backgroundColor={"black"}>Add new student</Button>
                    <Modal isOpen={isOpen} onClose={() => { onClose(); reset(); setAlert("") }}>
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
                                    <Button onClick={() => { onClose(); reset() }}>Cancel</Button>
                                </ModalFooter>
                            </ModalContent>
                        </form>
                    </Modal>
                    <Modal isOpen={isOpenEdit} onClose={() => { onCloseEdit(); reset() }}>
                        <ModalOverlay />
                        <form onSubmit={handleSubmit((data) => onSubmitEdit(data))}>
                            <ModalContent>
                                <ModalHeader>
                                    Edit Student
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
                                            value={student?.name}
                                            onChange={handleChange}
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
                                            value={student?.subject}
                                            onChange={handleChange}
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
                                            value={student?.marks}
                                            onChange={handleChange}
                                            placeholder='Marks'
                                        />
                                        {errors.marks && <Text color={"red"}>{errors.marks.message}</Text>}
                                    </FormControl>
                                </ModalBody>
                                <ModalFooter>
                                    <Button isLoading={loader} type="submit" colorScheme='blue' mr={3}>
                                        Save
                                    </Button>
                                    <Button onClick={() => { onCloseEdit(); reset() }}>Cancel</Button>
                                </ModalFooter>
                            </ModalContent>
                        </form>
                    </Modal>
                </GridItem>
                <GridItem colSpan={{ base: 3}} padding={5}>
                    {deleteError &&
                        <Alert fontSize={"smaller"} status={"error"} marginBottom={4}>
                            <AlertIcon />
                            {deleteError}
                        </Alert>
                    }
                    {deleteAlert &&
                        <Alert fontSize={"smaller"} status={"success"} marginBottom={4}>
                            <AlertIcon />
                            {deleteAlert}
                        </Alert>
                    }
                    {error &&
                        <Alert fontSize={"smaller"} status={"error"} marginBottom={4}>
                            <AlertIcon />
                            {error}
                        </Alert>
                    }
                    <TableContainer>
                        <Table variant={"simple"}>
                            <Thead>
                                <Tr>
                                    <Th>Sr. no.</Th>
                                    <Th>Name</Th>
                                    <Th>Subject</Th>
                                    <Th>Marks</Th>
                                    <Th>Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    students.map((student) => {
                                        return (
                                            <Tr key={student._id}>
                                                <Td>1</Td>
                                                <Td>{student.name}</Td>
                                                <Td>{student.subject}</Td>
                                                <Td>{student.marks}</Td>
                                                <Td>
                                                    <Button
                                                        onClick={() => onEditStudent(student)}
                                                        size={"sm"}
                                                        marginRight={3}
                                                        backgroundColor={"blue"}
                                                        color={"white"}
                                                    >Edit
                                                    </Button>
                                                    <Button
                                                        onClick={() => onDelete(student._id)}
                                                        size={"sm"}
                                                        backgroundColor={"red"}
                                                        color={"white"}
                                                    >Delete
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        );
                                    })
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>
                </GridItem>
            </Grid>
        )
    }
}

export default Dashboard;