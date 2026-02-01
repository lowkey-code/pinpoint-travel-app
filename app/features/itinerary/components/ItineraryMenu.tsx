import { useState } from "react"
import { Menu, Portal } from "@ark-ui/react"
import { useItinerary } from "~/features/itinerary"
import type { ItineraryItem, ItemStatus, ItemPriority } from "~/features/itinerary"
import { DotsThreeVertical, PencilSimple, Trash, CheckCircle, Circle, ArrowsClockwise } from "@phosphor-icons/react"
import { ItemDrawer } from "./ItemDrawer"

interface ItineraryMenuProps {
  item: ItineraryItem
}

export function ItineraryMenu({ item }: ItineraryMenuProps) {
  const { updateItem, deleteItem, convertQuickToActivity } = useItinerary()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isQuick = item.itemType === "quick"

  const handleChangeStatus = (status: ItemStatus) => {
    updateItem(item.id, { status })
  }

  const handleChangePriority = (priority: ItemPriority) => {
    updateItem(item.id, { priority })
  }

  const handleDelete = () => {
    if (confirm("Deletar este item?")) {
      deleteItem(item.id)
    }
  }

  const handleMenuSelect = (details: { value: string }) => {
    const { value } = details

    // Handle status changes
    if (value === "planned" || value === "done" || value === "skipped") {
      handleChangeStatus(value as ItemStatus)
      return
    }

    // Handle priority changes
    const priorityMap: Record<string, ItemPriority> = {
      "priority-0": 0,
      "priority-1": 1,
      "priority-2": 2,
    }
    if (value in priorityMap) {
      handleChangePriority(priorityMap[value])
      return
    }

    // Handle main menu actions
    switch (value) {
      case "edit":
        setDrawerOpen(true)
        break
      case "convert":
        convertQuickToActivity(item.id)
        break
      case "delete":
        handleDelete()
        break
    }
  }

  return (
    <>
      <Menu.Root onSelect={handleMenuSelect}>
        <Menu.Trigger asChild>
          <button
            className="p-2 hover:bg-secondary rounded-lg transition-colors tap-target"
            aria-label="Mais opções"
            data-testid={`item-menu-${item.id}`}
          >
            <DotsThreeVertical className="w-4 h-4" weight="bold" />
          </button>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content className="bg-paper-card border border-paper-line rounded-lg shadow-lg p-1 min-w-[200px] z-50">
              {/* Edit */}
              <Menu.Item
                value="edit"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-secondary cursor-pointer"
              >
                <PencilSimple className="w-4 h-4" weight="bold" />
                <span>Editar</span>
              </Menu.Item>

              <Menu.Separator className="h-px bg-paper-line my-1" />

              {/* Status submenu */}
              <Menu.Root positioning={{ placement: "right-start" }} onSelect={handleMenuSelect}>
                <Menu.TriggerItem className="flex items-center justify-between gap-2 px-3 py-2 rounded hover:bg-secondary cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" weight="bold" />
                    <span>Status</span>
                  </div>
                  <span className="text-xs text-ink-utility">›</span>
                </Menu.TriggerItem>

                <Portal>
                  <Menu.Positioner>
                    <Menu.Content className="bg-paper-card border border-paper-line rounded-lg shadow-lg p-1 min-w-[160px] z-50">
                      <Menu.Item
                        value="planned"
                        className="px-3 py-2 rounded hover:bg-secondary cursor-pointer"
                      >
                        Planejado
                      </Menu.Item>
                      <Menu.Item
                        value="done"
                        className="px-3 py-2 rounded hover:bg-secondary cursor-pointer"
                      >
                        Feito
                      </Menu.Item>
                      <Menu.Item
                        value="skipped"
                        className="px-3 py-2 rounded hover:bg-secondary cursor-pointer"
                      >
                        Pulado
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>

              {/* Priority submenu */}
              <Menu.Root positioning={{ placement: "right-start" }} onSelect={handleMenuSelect}>
                <Menu.TriggerItem className="flex items-center justify-between gap-2 px-3 py-2 rounded hover:bg-secondary cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Circle className="w-4 h-4" weight="bold" />
                    <span>Prioridade</span>
                  </div>
                  <span className="text-xs text-ink-utility">›</span>
                </Menu.TriggerItem>

                <Portal>
                  <Menu.Positioner>
                    <Menu.Content className="bg-paper-card border border-paper-line rounded-lg shadow-lg p-1 min-w-[160px] z-50">
                      <Menu.Item
                        value="priority-0"
                        className="px-3 py-2 rounded hover:bg-secondary cursor-pointer"
                      >
                        Normal
                      </Menu.Item>
                      <Menu.Item
                        value="priority-1"
                        className="px-3 py-2 rounded hover:bg-secondary cursor-pointer"
                      >
                        Importante
                      </Menu.Item>
                      <Menu.Item
                        value="priority-2"
                        className="px-3 py-2 rounded hover:bg-secondary cursor-pointer"
                      >
                        Imperdível
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>

              <Menu.Separator className="h-px bg-paper-line my-1" />

              {/* Convert quick to activity */}
              {isQuick && (
                <>
                  <Menu.Item
                    value="convert"
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-secondary cursor-pointer"
                  >
                    <ArrowsClockwise className="w-4 h-4" weight="bold" />
                    <span>Converter para Atividade</span>
                  </Menu.Item>
                  <Menu.Separator className="h-px bg-paper-line my-1" />
                </>
              )}

              {/* Delete */}
              <Menu.Item
                value="delete"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-stamp-brick/10 text-stamp-brick cursor-pointer"
              >
                <Trash className="w-4 h-4" weight="bold" />
                <span>Deletar</span>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      {/* Edit drawer */}
      <ItemDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        dayIndex={item.dayIndex}
        segment={item.segment}
        item={item}
      />
    </>
  )
}
