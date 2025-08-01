// Định nghĩa kiểu cho kết quả của hàm hashPassword
interface HashResult {
    hash: string;
    salt: number[];
}

// Hàm mã hóa mật khẩu bằng PBKDF2
export async function hashPassword(password: string, salt: Uint8Array | null = null): Promise<HashResult> {
    try {
        // Nếu không có salt, tạo một salt ngẫu nhiên
        if (!salt) {
            salt = crypto.getRandomValues(new Uint8Array(16)); // Salt 16 bytes
        }

        // Chuyển đổi mật khẩu thành buffer
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);

        // Tạo key từ mật khẩu bằng PBKDF2
        const key: CryptoKey = await crypto.subtle.importKey(
            "raw",
            passwordBuffer,
            { name: "PBKDF2" },
            false,
            ["deriveBits"]
        );

        // Tạo hash bằng PBKDF2
        const hash: ArrayBuffer = await crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000, // Số lần lặp cho độ an toàn
                hash: "SHA-256",
            },
            key,
            256 // Độ dài bit của hash
        );

        // Chuyển đổi hash thành chuỗi hex
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

        // Trả về hash và salt
        return { hash: hashHex, salt: Array.from(salt) };
    } catch (err: unknown) {
        console.error("Error hashing password:", err);
        throw err instanceof Error ? err : new Error("Unknown error in hashPassword");
    }
}

// Hàm xác thực mật khẩu
export async function verifyPassword(password: string, storedHash: string, storedSalt: number[]): Promise<boolean> {
    try {
        // Chuyển đổi salt từ mảng số thành Uint8Array
        const salt = new Uint8Array(storedSalt);

        // Tạo hash mới từ mật khẩu người dùng nhập
        const { hash }: HashResult = await hashPassword(password, salt);

        // So sánh hash mới với hash đã lưu
        return hash === storedHash;
    } catch (err: unknown) {
        console.error("Error verifying password:", err);
        throw err instanceof Error ? err : new Error("Unknown error in verifyPassword");
    }
}

// async function test() {
//     console.log(await verifyPassword('123', '76c9afd7eaf3e1fba4f46261aaac7b40f8dbb95aac531baf03c3c730bbef335b',
//         [24, 193, 173, 68, 183, 138, 161, 172, 52, 43, 208, 61, 75, 238, 168, 218]
//     ))
// }

// test();