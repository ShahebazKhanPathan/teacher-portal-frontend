import { Alert, AlertIcon, Button, Card, CardBody, Center, Grid, GridItem, Image, Input, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import apiClient from "../services/apiClient";
import checkTokenExpiry from "../utils/tokenExpiry";

// Create user schema
interface User{
    id: string,
    password: string
}

// Get token
const token = localStorage.getItem("auth-token");

// API for checking token expiry
const expiry = async () => {
    return await checkTokenExpiry();
}

const Home = () => {

    const result = expiry();

    if (!result || !token) {

        // Handle states
        const { register, handleSubmit, formState: { errors }, reset } = useForm<User>();
        const [loader, setLoader] = useState(false);
        const [alert, setAlert] = useState('');

        // Check token expiry
        useEffect(() => {
            checkTokenExpiry();
        }, []);
        
        // Handle form submit
        const onSubmit = async (data: User) => {

            setLoader(true);
            const { id, password } = data;
        
            // API call for user login
            await apiClient.post("/api/user", { id: id, password: password })
                .then(({ data }) => {
                    reset();
                    localStorage.setItem("auth-token", data);
                    location.href = "/dashboard";
                })
                .catch(({ response }) => {
                    setLoader(false);
                    setAlert(response.data);
                });
        };

        // Render home component
        return (
            <Grid
                templateColumns={{
                    base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(8, 1fr)",
                    lg: "repeat(12, 1fr)", xl: "repeat(12, 1fr)"
                }}
                padding={{ base: 5, sm: 5, md: 8, lg: 12, xl: 10}}
                alignItems="center"
                gap={5}
            >
                <GridItem colSpan={{base: 1, sm: 2, md: 8, lg: 12, xl: 12}} textAlign={"center"} rowSpan={1}>
                    <Text fontSize={{base: "x-large", sm: "x-large", md: "xx-large", lg: "xx-large", xl: "xxx-large"}}>Teacher Portal</Text>
                </GridItem>
                <GridItem colSpan={{ base: 1, sm: 2, md: 4, lg: 6, xl: 7 }}>
                    <Center>
                        <Image
                            src="../../public/managment-software.png"
                            boxSize={{base: "380px", sm: "400px", md: "450px", lg: "450px", xl: "550px"}}
                            objectFit="contain"
                        />
                    </Center>
                </GridItem>
                <GridItem colSpan={{ base: 1, sm: 2, md: 4, lg: 4, xl: 4}}>
                    {alert &&
                        <Alert status='error' marginBottom={4}>
                            <AlertIcon />
                            {alert}
                        </Alert>
                    }
                    <Card padding={4}>
                        <CardBody>
                            <Text fontSize="x-large" align="center" marginBottom={5}>Login</Text>
                            <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                                <Input
                                    size={{ base: "sm", sm: "sm", md: "md", lg: "md", xl: "lg"}}
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
                                    size={{ base: "sm", sm: "sm", md: "md", lg: "md", xl: "lg"}}
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
                                    size={{ base: "sm", sm: "sm", md: "md", lg: "md", xl: "lg"}}
                                    isLoading={loader}
                                    width={"100%"}
                                    type="submit"
                                    marginTop={5}
                                    backgroundColor="black"
                                    color="white">Login
                                </Button>
                            </form>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem></GridItem>
            </Grid>
        )
    }
    else {
        // Redirect to dashboard if already logged in
        location.href = "/dashboard";
    }
}

export default Home;