const getAgentFullName = (firstName?: string, lastName?: string) =>
  firstName === lastName ? firstName || '' : `${firstName} ${lastName}`;

export default getAgentFullName;
