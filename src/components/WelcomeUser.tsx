import LoadingUserName from './passenger/home/LoadingUserName';

const WelcomeUser = ({
  loading,
  firstName,
  firstLastName,
}: {
  loading: boolean;
  firstName: string;
  firstLastName: string;
}) => {
  return loading ? (
    <>
      <LoadingUserName />
    </>
  ) : (
    <h1 className="text-[1.5rem]  text-cxBlue font-semibold ">
      Bienvenido, <br /> {firstName?.toUpperCase()}{' '}
      {firstLastName?.toUpperCase()}
    </h1>
  );
};

export default WelcomeUser;
