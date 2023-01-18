export default function Index() {
  const sampleLink = `/search?query=${encodeURI('(req.status=200 AND (name:"aaa bbb" OR (age > 40 AND id = 124-421-4124-4214) OR (age > 23 AND id = 123-3123-5125)))')}`;
  return (
    <>
      <a href={sampleLink}>sample</a>
    </>
  );
}
