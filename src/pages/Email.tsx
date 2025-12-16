import { useState, useRef, useEffect } from "react";
import Dialog from "../components/Dialog";
import { TaskOnEmbed,  } from "@taskon/embed";
import "./Email.css";
import { signMessage } from "../utils/signMessage.ts";

export default function Email() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [lastEmail, setLastEmail] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<TaskOnEmbed | null>(null);
  const [isEmbedInitialized, setIsEmbedInitialized] = useState(false);

  // 处理邮箱确认
  const handleEmailConfirm = async (email: string) => {
    if (!embedRef.current) {
      console.error("Embed not initialized");
      return;
    }

    if (!embedRef.current.initialized) {
      console.log("TaskOn embed is not initialized yet, please wait...");
      return;
    }
    setEmails((prev) => [...prev, email]);
    setLastEmail(email);
    try {
      const clientId = import.meta.env.VITE_PUBLIC_TASKON_CLIENT_ID!;
      const { signature, timestamp } = await signMessage(
        clientId,
        "Email",
        email,
      );
      console.log("Logging in with email:", email);

      await embedRef.current.login({
        type: 'Email',
        account: email,
        signature: signature,
        timestamp: timestamp,
      });
      console.log('login success');


      localStorage.setItem("taskon_current_email", email);
      localStorage.setItem("taskon_email_login_state", "true");


    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    } finally {
      setIsDialogOpen(false);
    }
  };

  // 打开弹窗
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  // 关闭弹窗
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  
  const logout = () => {
    if (!embedRef.current) return;
    embedRef.current.logout();
    setIsDialogOpen(false);
    setLastEmail('');
    localStorage.removeItem('taskon_email_login_state');
    localStorage.removeItem('taskon_current_email');
  };

  // 清空邮箱列表
  const clearEmails = () => {
    setEmails([]);
    setLastEmail("");
    logout();
  };

  useEffect(() => {
    if (!containerRef.current) return;
    console.log('import.meta.env.VITE_PUBLIC_TASKON_BASE_URL!', import.meta.env.VITE_PUBLIC_TASKON_BASE_URL!);
    console.log('containerRef', containerRef.current);

    

    const embed = new TaskOnEmbed({
      baseUrl: import.meta.env.VITE_PUBLIC_TASKON_BASE_URL!,
      containerElement: containerRef.current,
      oauthToolUrl: "https://stage.generalauthservice.com",
    });

    const handleRouteChanged = (fullPath: string) => {
      console.log("TaskOn route changed:", fullPath);
      // You can synchronize and update the parent page's URL or state here
      // Example: window.history.replaceState(null, '', `/email${fullPath}`);
    };

    embed.on("routeChanged", handleRouteChanged);

    console.log("embed", embed);
    embed.init().then(() => {
      embedRef.current = embed;
      console.log("embedRef.current", embedRef.current);
      console.log("embedRef.current2223e42q323", embedRef.current);
      const email = localStorage.getItem('taskon_current_email') || '';
      setEmails([email]);
      setLastEmail(email);


      setIsEmbedInitialized(true);
    });

    return () => {
      embed.destroy();
      embedRef.current = null;
      setIsEmbedInitialized(false);
    };
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>📧 邮箱管理页面</h1>

      <div
        style={{
          backgroundColor: "#e3f2fd",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
          border: "1px solid #bbdefb",
        }}
      >
        <h2>功能说明</h2>
        <p>
          点击下方按钮可以打开邮箱输入弹窗，输入有效邮箱后确认即可添加到邮箱列表中。
        </p>
      </div>

      {/* 操作按钮区域 */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={openDialog}
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease",
          }}
        >
          📝 添加邮箱
        </button>

        {emails.length > 0 && (
          <button
            onClick={clearEmails}
            style={{
              padding: "12px 24px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease",
            }}
          >
            🗑️ 清空列表
          </button>
        )}
      </div>

      {/* 最新添加的邮箱显示 */}
      {lastEmail && (
        <div
          style={{
            backgroundColor: "#d4edda",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #c3e6cb",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", color: "#155724" }}>
            ✅ 最新添加
          </h3>
          <p style={{ margin: 0, fontSize: "16px", fontWeight: "500" }}>
            {lastEmail}
          </p>
        </div>
      )}

      {/* TaskOn Embed Container */}
      <main>
        <div ref={containerRef} className="email-container" />
      </main>

      {/* 弹窗组件 */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onConfirm={handleEmailConfirm}
        title="添加新邮箱"
      />
    </div>
  );
}
