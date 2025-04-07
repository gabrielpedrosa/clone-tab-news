function status(request, response) {
  response.status(200).json({ chave: "Show!" });
}

export default status;
