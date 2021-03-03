export default function location(state = "Seattle, WA", action: any) {
    switch (action.type) {
        case "CHANGE_LOCATION":
            return action.payload;
        default:
            return state;
    }
}