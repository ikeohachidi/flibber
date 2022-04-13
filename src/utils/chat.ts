export const chatId = (user1Id: number, user2Id: number) => {
	if (user1Id < user2Id) return Number(`${user1Id}${user2Id}`);

	return Number(`${user2Id}${user1Id}`);
}