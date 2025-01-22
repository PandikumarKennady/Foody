import { getEntry, getEntryByUrl } from "../sdk/entry";
import { addEditableTags } from "@contentstack/utils";


// const liveEdit = process.env.REACT_APP_CONTENTSTACK_LIVE_EDIT_TAGS === "true";

export const getNavBarRes = async() =>{

  const response = (
    await getEntry({
      contentTypeUid:"navigation_bar",
      referenceFieldPath:[],
      jsonRtePath:[]
    })
  );
  return response[0][0];
}

export const getCarouselRes = async() =>{
  const response = (
    await getEntry({
      contentTypeUid:"carousel",
      referenceFieldPath:[],
      jsonRtePath:[]
    })
  );
  return response[0][0];
}

export const getResponse = async(uid) =>{
  const response = (
    await getEntry({
      contentTypeUid:uid,
      referenceFieldPath:[],
      jsonRtePath:[]
    })
  );
  return response[0][0];
}

export const getFoodResponse = async() =>{
  const response = (
    await getEntry({
      contentTypeUid:'foods',
      referenceFieldPath:[],
      jsonRtePath:[]
    })
  );
  return response[0];
}

export const getCardDishResponse = async(url) =>{
  const response = (
    await getEntryByUrl({
      contentTypeUid:'foods',
      entryUrl: '/foods/'+url,
      referenceFieldPath:[],
      jsonRtePath:[]
    })
  );
  return response[0];
}