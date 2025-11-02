interface Props {
  tab: string;
  range: string
}

export default ({ tab, range }: Props): string[] => {
  return ['Average 8 pees per day', 'Averages 5 poops per day'];
}