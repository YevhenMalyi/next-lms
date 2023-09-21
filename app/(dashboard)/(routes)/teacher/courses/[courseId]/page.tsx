const CourceIdPage = ({
  params: { courseId }
} : {
  params: { courseId: string }
}) => {
  return ( 
    <div>course id: { courseId }</div>
  );
};
 
export default CourceIdPage;