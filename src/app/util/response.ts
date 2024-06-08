export function errorResponse(
  message: string = 'Uh-oh! Looks like something went wrong. Our crack team of chemical engineers and electrotechnicians is on the case. Please try again later!',
  status: number = 500,
) {
  return Response.json({ message }, { status });
}
