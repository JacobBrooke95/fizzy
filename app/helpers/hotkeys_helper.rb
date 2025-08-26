module HotkeysHelper
  def hotkey_label(hotkey)
    hotkey.split(",").first if hotkey
    case hotkey
    when Array
      hotkey.map { |key|
        if key == "ctrl" && platform.mac?
          "⌘"
        elsif key == "enter"
          platform.mac? ? "return" : "enter"
        else
          key
        end
      }.join()
    else
      hotkey.split(",").first if hotkey
    end
  end
end
