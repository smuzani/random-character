update dialogue.models
set short_price = 1,
    medium_price = case when medium_price is not null then 1 end
where id = 'gemini-3.1-flash-lite';
