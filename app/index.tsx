import { Redirect } from "expo-router";

const Home = () => {
  return <Redirect href={"/(auth)/forgot-password"} />;
};

export default Home;
