-- Necessary functions for Flibber

CREATE OR REPLACE FUNCTION get_contacts(userid int)
RETURNS SETOF "user" 
AS
$function$
BEGIN
	RETURN QUERY
	SELECT "user".*
	FROM contact
	LEFT JOIN "user" ON
	CASE
	    WHEN contact.user1 = userid THEN contact.user2 = "user".id
	    WHEN contact.user2 = userid THEN contact.user1 = "user".id
	END
END;
$function$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_recent_chats(userid int)
RETURNS TABLE (
	id 					bigint,
	message 			json,
	conversation_id		int,
	created_at			timestamp,
	from				json,
	to					json
)
AS
$function$
BEGIN
	SELECT t.id, t.message, t.conversation_id, r.created_at, row_to_json(p1) as "from", row_to_json(p2) as "to"
	FROM chat AS t
	JOIN (
	  SELECT MAX(created_at) as created_at, conversation_id
	  FROM chat
	  GROUP BY conversation_id
	) AS r
	ON t.created_at = r.created_at
	JOIN "user" AS p1
	ON p1.id = t."from"
	JOIN "user" AS p2
	ON p2.id = t."to"
	WHERE t."from" = userid OR t."to" = userid;
END;
$function$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION accept_contact_request(sendee int, sender int)
RETURNS bool
AS
$function$
BEGIN
  -- do some logic here
  DELETE FROM contact_request 
  WHERE requestee = sendee 
  AND requester = sender;

  INSERT 
  INTO contact (user1, user2) 
  VALUES (sendee, sender);

  RETURN true;
  -- in case of an error, fail:
  RAISE EXCEPTION 'Didnt work'
        USING DETAIL = 'Error occured somewhere',
              HINT = 'Not particularly sure';
 -- the above will cause a rollback
END;
$function$ LANGUAGE plpgsql;