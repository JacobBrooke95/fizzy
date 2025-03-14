module MessagesHelper
  def messages_tag(bubble, &)
    turbo_frame_tag dom_id(bubble, :messages),
      class: "comments align-center center borderless margin flex flex-column gap-half",
      style: "--bubble-color: <%= bubble.color %>",
      role: "group", aria: { label: "Messages" },
      data: {
        controller: "created-by-current-user",
        created_by_current_user_mine_class: "comment--mine"
      }, &
  end
end
