-- Localise the demo catalogue without changing activity IDs that existing plans reference.
update activities
set
  name = case name
    when 'Riverside Cafe Brunch' then 'Titiwangsa Lakeside Brunch'
    when 'Kings Park Botanical Walk' then 'Perdana Botanical Garden Walk'
    when 'Art Gallery Quiet Hour' then 'ILHAM Gallery Quiet Visit'
    when 'Fremantle Photography Stroll' then 'Kwai Chai Hong Photography Stroll'
    when 'Day Spa Relaxation Session' then 'Subang Jaya Relaxation Session'
    when 'Community Choir Sing-Along' then 'Petaling Jaya Community Sing-Along'
    when 'WA Museum Story Tour' then 'National Museum Story Tour'
    when 'Matinee at His Majesty''s' then 'Matinee at DPAC'
    when 'Subiaco Farmers Market' then 'SS15 Community Market'
    when 'Matilda Bay Tea House' then 'Subang Ria Lakeside Tea'
    else name
  end,
  description = case name
    when 'Riverside Cafe Brunch' then 'A relaxed lakeside brunch with shaded seating, an easy pace, and a peaceful city-park setting.'
    when 'Kings Park Botanical Walk' then 'A gentle garden walk with shady paths, frequent places to pause, and tropical greenery.'
    when 'Art Gallery Quiet Hour' then 'An unhurried gallery visit with lift access, seating, and time to enjoy Malaysian modern art.'
    when 'Fremantle Photography Stroll' then 'A colourful heritage-lane photo walk with nearby cafes and regular rest stops.'
    when 'Day Spa Relaxation Session' then 'A quiet 60-minute relaxation session with a comfortable lounge and convenient nearby parking.'
    when 'Community Choir Sing-Along' then 'A friendly seated sing-along for all experience levels, with time to chat afterwards.'
    when 'WA Museum Story Tour' then 'A gently paced museum highlights visit with lifts, seating, and stories from across Malaysia.'
    when 'Matinee at His Majesty''s' then 'An afternoon performance in a comfortable theatre with reserved seating and nearby amenities.'
    when 'Subiaco Farmers Market' then 'A relaxed neighbourhood market outing with local food, cafe stops, and flexible walking.'
    when 'Matilda Bay Tea House' then 'A peaceful lakeside tea stop with shaded seating, level access, and a simple light menu.'
    else description
  end,
  location_text = case name
    when 'Riverside Cafe Brunch' then 'Taman Tasik Titiwangsa, Kuala Lumpur'
    when 'Kings Park Botanical Walk' then 'Perdana Botanical Gardens, Kuala Lumpur'
    when 'Art Gallery Quiet Hour' then 'ILHAM Gallery, Kuala Lumpur'
    when 'Fremantle Photography Stroll' then 'Kwai Chai Hong, Kuala Lumpur'
    when 'Day Spa Relaxation Session' then 'SS15, Subang Jaya'
    when 'Community Choir Sing-Along' then 'PJ Live Arts, Petaling Jaya'
    when 'WA Museum Story Tour' then 'Muzium Negara, Kuala Lumpur'
    when 'Matinee at His Majesty''s' then 'Damansara Performing Arts Centre, Petaling Jaya'
    when 'Subiaco Farmers Market' then 'SS15, Subang Jaya'
    when 'Matilda Bay Tea House' then 'Taman Tasik Subang Ria, Subang Jaya'
    else location_text
  end,
  lat = case name
    when 'Riverside Cafe Brunch' then 3.1770
    when 'Kings Park Botanical Walk' then 3.1433
    when 'Art Gallery Quiet Hour' then 3.1546
    when 'Fremantle Photography Stroll' then 3.1418
    when 'Day Spa Relaxation Session' then 3.0738
    when 'Community Choir Sing-Along' then 3.1117
    when 'WA Museum Story Tour' then 3.1379
    when 'Matinee at His Majesty''s' then 3.1249
    when 'Subiaco Farmers Market' then 3.0750
    when 'Matilda Bay Tea House' then 3.0789
    else lat
  end,
  lng = case name
    when 'Riverside Cafe Brunch' then 101.7068
    when 'Kings Park Botanical Walk' then 101.6841
    when 'Art Gallery Quiet Hour' then 101.7158
    when 'Fremantle Photography Stroll' then 101.6972
    when 'Day Spa Relaxation Session' then 101.5880
    when 'Community Choir Sing-Along' then 101.6377
    when 'WA Museum Story Tour' then 101.6870
    when 'Matinee at His Majesty''s' then 101.6232
    when 'Subiaco Farmers Market' then 101.5875
    when 'Matilda Bay Tea House' then 101.5824
    else lng
  end,
  ai_summary = case name
    when 'Riverside Cafe Brunch' then 'A gentle Kuala Lumpur brunch with lakeside views, seating, and an easy social pace.'
    when 'Kings Park Botanical Walk' then 'A shaded city-garden walk with places to rest and a flexible route.'
    when 'Art Gallery Quiet Hour' then 'A calm indoor art visit with lift access, seating, and comfortable pacing.'
    when 'Fremantle Photography Stroll' then 'A compact heritage photo walk with colourful scenes, rest stops, and cafes nearby.'
    when 'Day Spa Relaxation Session' then 'A low-effort wellness option in Subang Jaya with comfortable facilities.'
    when 'Community Choir Sing-Along' then 'A sociable seated activity in Petaling Jaya with gentle participation.'
    when 'WA Museum Story Tour' then 'An accessible cultural visit with lifts, seating, and a flexible pace.'
    when 'Matinee at His Majesty''s' then 'A seated Petaling Jaya cultural afternoon with a comfortable interval.'
    when 'Subiaco Farmers Market' then 'A flexible Subang Jaya market visit with refreshments and places to pause.'
    when 'Matilda Bay Tea House' then 'A calm Subang Jaya tea stop with lakeside views and level access.'
    else ai_summary
  end
where name in (
  'Riverside Cafe Brunch',
  'Kings Park Botanical Walk',
  'Art Gallery Quiet Hour',
  'Fremantle Photography Stroll',
  'Day Spa Relaxation Session',
  'Community Choir Sing-Along',
  'WA Museum Story Tour',
  'Matinee at His Majesty''s',
  'Subiaco Farmers Market',
  'Matilda Bay Tea House'
);

update preferences
set location_text = 'Kuala Lumpur', lat = 3.1390, lng = 101.6869
where location_text ilike '%perth%';
