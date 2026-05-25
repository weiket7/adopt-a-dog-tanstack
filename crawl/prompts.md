# Gemini

## OSCAS

use node to crawl https://www.oscas.sg/adoption-gallery to get list of dogs and download images from squarespace-cdn

for each element with class "sqs-block gallery-block sqs-block-gallery", download the image with format oscas-dog-name
if there's code to skip images which don't contain particular domain, skip images which don't contain squarespace-cdn

in its subsequent element "sqs-block html-block sqs-block-html", in the h2 element get the dog's name, in the ul element get gender, year of birth (calculate from age if this is not present, write as example 2011-01-01), whether it's hdb approved as Yes or No

the subsequent p element is the dog's description

generate the list of dogs in a json like
{
"id": 1,
"name": "Teddy",
"gender": "Male",
"birthday": "2020-01-01",
"hdbApproved": "Yes",
"description": "",
"image": "",
"welfareGroupId": "kn74zp6qsmh31fswa05dv7rqwn81jfg8"
}

## ASD

```
    SELECT name,
    case
    when gender = 'F' then 'Female'
    when gender = 'M' then 'Male'
    end as gender,
    birthday,
    case when hdb = 1 then 'Yes' else 'No' end as hdbApproved,
    CONCAT(COALESCE(desc, ''), ' ', COALESCE(`history`, '')) AS description,
    'kn71zay6jrmajyhaqtp0ch7xe981j4gz' as welfareGroupId
    FROM `adopt` WHERE stat in ('A', 'F')
    and deleted_at is null;
```

## SOSD

crawl https://www.sosd.org.sg/adopt-a-dog/

for each element with class "dog-loop-inner", download the image into another folder called sosd, get the dog's name, whether hdb approved, birthday (calculate from age if this is not present, write as example 2011-01-01) and click on the image

in the subsequent link, look for Personality: and get the description, stop at "If you wish to share" and exclude it

for each dog, open https://adopt-a-dog.wei-ket.workers.dev/admin/dogs
click #btn-add-a-dog
in the modal, look for id="f-name" and enter the name
look for id="f-birthday" and enter the birthday
for gender = Male, click on id="gender-male", for gender = Female, click on id="gender-female"
for hdb approved = true, click on id="hdb-yes", for hdb approved = false, click on id="hdb-no"
for image, click on the id="image" and upload the file
for description, fill in id="f-description"

write node.js

## SPCA

https://spca.org.sg/services/adoption/?sam_type=dog&sam_age=&sam_status=&sam_hdb=

in element with css "sam-animals-grid sam-grid-cols-3", for each element with css "sam-animal-card sam-programme-adoption", download the image, get the dog's name, click on the link

in the link, look for element with css "sam-story-section", get the gender, breed, birthday (calculate from age if this is not present, write as example 2011-01-01), whether it's hdb approved, description

look for element with css page-numbers, go to next page and continue until it's done

generate the list of dogs in a json like
{
"id": 1,
"name": "Teddy",
"gender": "Male",
"birthday": "2020-01-01",
"hdbApproved": "Yes",
"description": "",
"localImagePath": "",
"welfareGroupId": "kn7bpkb6tncrrnxzc9mpz3a7r181jr3w"
}

## Mercylight

https://mercylight.org.sg/adopt-a-blessing/adopt-a-lady-blessing/

repeat it for https://mercylight.org.sg/adopt-a-blessing/adopt-a-gentleman-blessing/

below the text "introduce you to the joy of pet ownership."

for look elements with class "elementor-column elementor-col-25 elementor-top-column elementor-element"

for each of them that has an img tag, download the image, get the dog's name and click on the link
exclude links to http://mercylight.medialabsstreaming.com/ and https://mercylight.org.sg/

look for span elements for "Name:", "Gender:", "HDB approved", "Date of Birth" instead and extract the subsequent text
for name, if name is like Ava Blessing, exclude " Blessing"
for date of birth, format as examaple "2011-01-01"
for description, merge Background: ... and Personality .. with 2 line breaks
if there's no value, set as null

generate the list of dogs in a json like
{
"id": 1,
"name": "Teddy",
"gender": "Male",
"birthday": "2020-01-01",
"hdbApproved": "Yes",
"description": "",
"image": "",
"welfareGroupId": "kn7df7dx9b345x9j1v2b6rh9yd81j0c3"
}

## CAS

https://www.causesforanimals.com/our-animals.html

https://hopedogrescue.blogspot.com/

## Chained dog awareness

https://chaineddogawareness.sg/adoption/

below section element "We are ready for a new home!"

look for elements with class .elementor-column.elementor-col-25, navigate to the link

download the image, look for h2 containing dog's name

look for span element containing "Breed",
in this span, look for "Gender:", "HDB approved or "non-HDB approved", "Age"
for date of birth, format as example "2011-01-01"
in the subsequent p elements below hdb approved, parse the p elements into a description with line breaks

stop when see a section element having text "Dogs That Have Happily Found Their Forever Homes"

generate the list of dogs in a json like
{
"id": 1,
"name": "Teddy",
"gender": "Male",
"birthday": "2020-01-01",
"hdbApproved": "Yes",
"description": "",
"image": "",
"welfareGroupId": "kn76a3f1aaec6mw9w5wgrypssd87a52y"
}

## Import

given json like
[
{
"id": 2,
"name": "Damien",
"hdbApproved": "Yes",
"birthday": "2016-01-01",
"localImagePath": "sosd/2_Damien.jpg",
"sourceImageUrl": "https://www.sosd.org.sg/wp-content/uploads/2025/10/Damien-e1761571073306-300x198.jpg",
"profileUrl": "https://www.sosd.org.sg/damien/",
"description": ""
}
]

open file named sosd.json containing the above

for each dog, open https://adopt-a-dog.wei-ket.workers.dev/admin/dogs

click #btn-add-a-dog

in the modal, look for id="f-name" and enter the name

look for id="f-birthday" and enter the birthday

for gender = Male, click on id="gender-male", for gender = Female, click on id="gender-female"

for hdb approved = true, click on id="hdb-yes", for hdb approved = false, click on id="hdb-no"

for image, click on the id="image" and upload the file

for description, fill in id="f-description"

for id="f-welfare-group", select value="kn719cj5kbhfv64m5tz890d2dd81j0pt", make this a variable at the top for ease of change

click the submit button and wait for modal to close, then repeat

write node.js
