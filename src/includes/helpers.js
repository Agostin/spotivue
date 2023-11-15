const formatTime = (input) => {
  return new Date(input * 1000).toISOString().slice(11, 19).replace('00:', '')
}

export { formatTime }
