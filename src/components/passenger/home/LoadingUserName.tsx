import { Skeleton } from '@mui/material';


const LoadingUserName = () =>{
    return (
        <>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={30}
          className="rounded-lg mt-2"
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={30}
          className="rounded-lg mt-2"
        />
      </>
    )
}

export default LoadingUserName;