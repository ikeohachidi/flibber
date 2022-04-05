const conversationIdGenerator = (participant1: number, participant2: number): string => {
	if (participant1 > participant2) return `${participant1}${participant2}`;

	return `${participant2}${participant1}`;
}

export {
	conversationIdGenerator
}