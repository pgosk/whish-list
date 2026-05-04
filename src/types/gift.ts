export interface Gift {
    id: string;
    name: string;
    image_url: string;
    shop_url: string;
    reserved_by_user_id: string | null;
    reserved_by_name: string | null;
    created_at: string;
}
