import { Redirect } from "expo-router";

const Home = () => {
  return <Redirect href={"/(auth)/signup"} />;
};

export default Home;
