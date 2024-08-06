import { Alert, AlertIcon, Button, Card, CardBody, Grid, GridItem, Image, Input, Text } from "@chakra-ui/react"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import apiClient from "../services/apiClient";

interface User{
    id: string,
    password: string
}

const Home = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<User>();
    const [ loader, setLoader ] = useState(false);
    const [ alert, setAlert ] = useState('');
    
    const onSubmit = async (data: User) => {

        setLoader(true);
        const { id, password } = data;
        await apiClient.post("/api/user", { id: id, password: password })
            .then((data) => {
                setLoader(false);
                console.log(data);
            })
            .catch((err) => {
                setLoader(false);
                setAlert(err.message);
                setTimeout(() => { setAlert('') }, 10000);
            });
    }

    return (
        <Grid templateColumns={"repeat(12, 1fr)"} padding={10} alignItems="center" gap={5}>
            <GridItem colSpan={12} textAlign={"center"} rowSpan={1}>
                <Text fontSize="xxx-large">Teacher Portal</Text>
            </GridItem>
            <GridItem colSpan={1}></GridItem>
            <GridItem colSpan={5}>
                <Image src="../../public/managment-software.png" boxSize="550px" objectFit="contain"/>
            </GridItem>
            <GridItem colSpan={4}>
                { alert &&
                    <Alert status='error' marginBottom={4}>
                        <AlertIcon />
                        { alert }
                    </Alert>
                }
                <Card padding={4}>
                    <CardBody>
                        <Text fontSize="x-large" align="center" marginBottom={5}>Login</Text>
                        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                            <Input
                                {...register("id",
                                    {
                                        required: "User ID is required",
                                        minLength: { value: 5, message: "User ID must be atleast 5 characters long." }
                                    })
                                }
                                placeholder="User ID"
                            />
                            {errors.id && <Text color={"red"}>{errors.id.message}</Text>}
                            
                            <Input
                                placeholder="Password" 
                                {...register("password",
                                    {
                                        required: "Password is required",
                                        minLength: { value: 8, message: "Password must be atleast 8 characters long." }
                                    })
                                }
                                marginTop={5}
                            />
                            {errors.password && <Text color={"red"}>{errors.password.message}</Text>}

                            <Button
                                isLoading={loader}
                                width={"100%"}
                                type="submit"
                                marginTop={5}
                                backgroundColor="black"
                                color="white">Login
                            </Button>
                            
                            <Text marginTop={4}><Link to={"/forget-password"}>Forget password?</Link></Text>
                        </form>
                    </CardBody>
                </Card>
            </GridItem>
        </Grid>
    )
}

export default Home;