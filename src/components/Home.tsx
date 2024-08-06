import { Card, CardBody, Grid, GridItem, Image, Input, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom";

const Home = () => {
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
                <Card padding={4}>
                    <CardBody>
                        <Text fontSize="x-large" align="center" marginBottom={5}>Login</Text>
                        <form>
                            <Input placeholder="User ID" marginBottom={5}/>
                            <Input placeholder="Password" marginBottom={5}/>
                            <Input type="button" value={"Login"} marginBottom={5} backgroundColor="black" color="white"/>
                            <Text><Link to={"/forget-password"}>Forget password?</Link></Text>
                        </form>
                    </CardBody>
                </Card>
            </GridItem>
        </Grid>
    )
}

export default Home;